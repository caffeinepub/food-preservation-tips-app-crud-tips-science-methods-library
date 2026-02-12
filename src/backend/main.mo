import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types for Food Preservation Tips
  public type FoodPreservationTip = {
    id : Nat;
    title : Text;
    content : Text;
    tags : ?[Text];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    author : Principal;
  };

  // Types for Science Explanations
  public type ScienceExplanation = {
    id : Nat;
    title : Text;
    summary : Text;
    steps : ?[Text];
    safetyNotes : ?Text;
    category : Text;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Comparison module for sorting tips
  module FoodPreservationTip {
    public func compare(a : FoodPreservationTip, b : FoodPreservationTip) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // State for tips and explanations
  let tipsState = Map.empty<Principal, Map.Map<Nat, FoodPreservationTip>>();
  let explanationsState = Map.empty<Nat, ScienceExplanation>();
  var nextTipId = 0;

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // CRUD Operations for Tips
  public shared ({ caller }) func createTip(title : Text, content : Text, tags : ?[Text]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tips");
    };

    let tipId = nextTipId;
    nextTipId += 1;

    let tip : FoodPreservationTip = {
      id = tipId;
      title;
      content;
      tags;
      createdAt = Time.now();
      updatedAt = Time.now();
      author = caller;
    };

    let userTips = switch (tipsState.get(caller)) {
      case (null) { Map.empty<Nat, FoodPreservationTip>() };
      case (?map) { map };
    };

    userTips.add(tipId, tip);
    tipsState.add(caller, userTips);

    tipId;
  };

  public shared ({ caller }) func updateTip(id : Nat, title : Text, content : Text, tags : ?[Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tips");
    };

    let userTips = switch (tipsState.get(caller)) {
      case (null) { Runtime.trap("Tip not found") };
      case (?map) { map };
    };

    let existingTip = switch (userTips.get(id)) {
      case (null) { Runtime.trap("Tip not found") };
      case (?tip) { tip };
    };

    let updatedTip : FoodPreservationTip = {
      id = existingTip.id;
      title;
      content;
      tags;
      createdAt = existingTip.createdAt;
      updatedAt = Time.now();
      author = existingTip.author;
    };

    userTips.add(id, updatedTip);
  };

  public shared ({ caller }) func deleteTip(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tips");
    };

    let userTips = switch (tipsState.get(caller)) {
      case (null) { Runtime.trap("Tip not found") };
      case (?map) { map };
    };

    switch (userTips.get(id)) {
      case (null) { Runtime.trap("Tip not found") };
      case (_) {
        userTips.remove(id);
      };
    };
  };

  public query ({ caller }) func getTip(id : Nat) : async ?FoodPreservationTip {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access tips");
    };

    let userTips = switch (tipsState.get(caller)) {
      case (null) { return null };
      case (?map) { map };
    };

    switch (userTips.get(id)) {
      case (null) { return null };
      case (?tip) { ?tip };
    };
  };

  public query ({ caller }) func getUserTips(user : Principal) : async [FoodPreservationTip] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tips");
    };

    switch (tipsState.get(user)) {
      case (null) { [] };
      case (?map) {
        map.values().toArray().sort();
      };
    };
  };

  // Operations for Science Explanations (Read-only library accessible to all)
  public shared ({ caller }) func addScienceExplanation(explanation : ScienceExplanation) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add explanations");
    };
    explanationsState.add(explanation.id, explanation);
  };

  public query func getScienceExplanation(id : Nat) : async ScienceExplanation {
    switch (explanationsState.get(id)) {
      case (null) { Runtime.trap("Explanation not found") };
      case (?explanation) { explanation };
    };
  };

  public query func getAllScienceExplanations() : async [ScienceExplanation] {
    explanationsState.values().toArray();
  };

  public query func getExplanationsByCategory(category : Text) : async [ScienceExplanation] {
    explanationsState.values().toArray().filter(func(e) { e.category == category });
  };
};
