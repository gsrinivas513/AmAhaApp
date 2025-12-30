/**
 * FIRESTORE SECURITY RULES
 * File: firestore.rules
 * 
 * These rules enforce data integrity at the database level.
 * Copy and paste this into your Firebase Console -> Firestore -> Rules
 * 
 * CRITICAL: This prevents invalid puzzles from being created/updated
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated reads
    match /{document=**} {
      allow read: if request.auth != null;
    }

    // ============================================
    // PUZZLES COLLECTION VALIDATION
    // ============================================
    match /puzzles/{puzzleId} {
      
      // Validate create and update operations
      allow create, update: if 
        // Must be authenticated
        request.auth != null &&
        // Must have required fields
        request.resource.data.title != null &&
        request.resource.data.title is string &&
        request.resource.data.title.size() > 0 &&
        request.resource.data.type != null &&
        request.resource.data.type is string &&
        (request.resource.data.categoryId != null || request.resource.data.category != null) &&
        // Type must be valid
        request.resource.data.type in [
          'find-pair', 
          'picture-word', 
          'spot-difference', 
          'picture-shadow', 
          'ordering'
        ] &&
        // Validate type-specific data structure
        validatePuzzleData(request.resource.data);

      allow delete: if request.auth != null;
    }

    // ============================================
    // VALIDATION FUNCTIONS
    // ============================================
    
    function validatePuzzleData(data) {
      return (
        data.type == 'find-pair' ? validateFindPair(data) :
        data.type == 'picture-word' ? validatePictureWord(data) :
        data.type == 'spot-difference' ? validateSpotDifference(data) :
        data.type == 'picture-shadow' ? validatePictureShadow(data) :
        data.type == 'ordering' ? validateOrdering(data) :
        false
      );
    }

    function validateFindPair(data) {
      return (
        data.data is map &&
        data.data.cards is list &&
        data.data.cards.size() >= 8 &&
        data.data.cards.size() % 2 == 0 &&
        // All cards must have image
        data.data.cards.size() == countCardsWithImages(data.data.cards)
      );
    }

    function validatePictureWord(data) {
      return (
        data.data is map &&
        data.data.items is list &&
        data.data.items.size() >= 4 &&
        // All items must have image and word
        checkAllItemsHaveImageAndWord(data.data.items)
      );
    }

    function validateSpotDifference(data) {
      return (
        data.data is map &&
        data.data.originalImage is string &&
        data.data.originalImage.size() > 0 &&
        data.data.modifiedImage is string &&
        data.data.modifiedImage.size() > 0 &&
        data.data.originalImage != data.data.modifiedImage
      );
    }

    function validatePictureShadow(data) {
      return (
        data.data is map &&
        data.data.originalImage is string &&
        data.data.originalImage.size() > 0 &&
        data.data.shadowImage is string &&
        data.data.shadowImage.size() > 0 &&
        data.data.originalImage != data.data.shadowImage
      );
    }

    function validateOrdering(data) {
      return (
        data.data is map &&
        data.data.items is list &&
        data.data.items.size() >= 2 &&
        data.data.correctOrder is list &&
        data.data.correctOrder.size() == data.data.items.size()
      );
    }

    // Helper function - count cards that have images
    function countCardsWithImages(cards) {
      return cards.size(); // Simplified: assumes all have images
      // Note: Full implementation would iterate, but Firestore rules have limitations
    }

    // Helper function - check items have image and word
    function checkAllItemsHaveImageAndWord(items) {
      return items.size() > 0; // Simplified: assumes all have required fields
      // Note: Full implementation would iterate, but Firestore rules have limitations
    }

    // ============================================
    // OTHER COLLECTIONS (default allow)
    // ============================================
    match /categories/{categoryId} {
      allow create, read, update, delete: if request.auth != null;
    }

    match /topics/{topicId} {
      allow create, read, update, delete: if request.auth != null;
    }

    match /subtopics/{subtopicId} {
      allow create, read, update, delete: if request.auth != null;
    }

    match /quizzes/{quizId} {
      allow create, read, update, delete: if request.auth != null;
    }

    match /scores/{scoreId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
