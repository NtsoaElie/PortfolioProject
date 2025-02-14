package com.elie.portfolio_be.auth;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FirebaseService {

    public boolean isAuthenticated(String token) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token.replace("Bearer ", ""));
            return decodedToken != null;
        } catch (FirebaseAuthException e) {
            return false;
        }
    }

    public String getUidFromToken(String token) {
        try {
            token = token.replace("Bearer ", "");  // Ensure token format
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
            System.out.println("Extracted UID: " + uid);  // Debugging line
            return uid;
        } catch (FirebaseAuthException e) {
            System.out.println("Token verification failed: " + e.getMessage());
            return null;
        }
    }


    public String setAdminClaim(String uid) {
        try {
            FirebaseAuth.getInstance().setCustomUserClaims(uid, Map.of("admin", true));
            return "success";
        } catch (FirebaseAuthException e) {
            return "Error: " + e.getMessage();
        }
    }
}
