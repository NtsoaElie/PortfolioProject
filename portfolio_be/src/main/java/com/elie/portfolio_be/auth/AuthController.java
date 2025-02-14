package com.elie.portfolio_be.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final FirebaseService firebaseService;

    @Autowired
    public AuthController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    // Promote a user to an admin
    @PostMapping("/set-admin")
    public ResponseEntity<String> setAdmin(@RequestBody String uid) {
        if (uid == null || uid.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: UID is required");
        }

        try {
            String result = firebaseService.setAdminClaim(uid);
            if ("success".equals(result)) {
                return ResponseEntity.ok("User with UID " + uid + " is now an admin.");
            } else {
                return ResponseEntity.status(500).body("Error: Failed to add admin claim.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
