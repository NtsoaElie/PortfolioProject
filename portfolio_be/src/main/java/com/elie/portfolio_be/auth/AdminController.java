package com.elie.portfolio_be.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final FirebaseService firebaseService;

    @Autowired
    public AdminController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    @PostMapping("/set-admin")
    public ResponseEntity<String> setAdmin(@RequestBody AdminRequest request, @RequestHeader("Authorization") String token) {
        System.out.println("Received request to set admin.");
        System.out.println("Received UID: " + request.getUid());
        System.out.println("Received token: " + token);

        if (request.getUid() == null || request.getUid().isEmpty()) {
            System.out.println("Error: UID is missing from request.");
            return ResponseEntity.badRequest().body("Error: UID is required");
        }

        boolean isAuthenticated = firebaseService.isAuthenticated(token);
        System.out.println("Token authentication result: " + isAuthenticated);
        if (!isAuthenticated) {
            System.out.println("Error: Unauthorized access attempt.");
            return ResponseEntity.status(403).body("Error: Unauthorized");
        }

        String currentUserUid = firebaseService.getUidFromToken(token);
        System.out.println("Extracted UID from token: " + currentUserUid);

        String yourUid = "zofrmaCWG7aDd9bxliZfQLhsFYN2";
        System.out.println("Expected admin UID: " + yourUid);

        if (!yourUid.equals(currentUserUid)) {
            System.out.println("Error: User is not authorized to perform this action.");
            return ResponseEntity.status(403).body("Error: You are not authorized to perform this action.");
        }

        try {
            System.out.println("Attempting to set admin claim for UID: " + request.getUid());
            String result = firebaseService.setAdminClaim(request.getUid());
            System.out.println("Firebase setAdminClaim result: " + result);

            if ("success".equals(result)) {
                System.out.println("Success: User " + request.getUid() + " is now an admin.");
                return ResponseEntity.ok("User with UID " + request.getUid() + " is now an admin.");
            } else {
                System.out.println("Error: Failed to add admin claim.");
                return ResponseEntity.status(500).body("Error: Failed to add admin claim.");
            }
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }



    @GetMapping("/data")
    public ResponseEntity<?> getAdminData() {
        return ResponseEntity.ok("Admin data available");
    }
}
