package com.example.cart.controller;

import com.example.cart.dto.AuthResponse;
import com.example.cart.dto.LoginRequest;
import com.example.cart.dto.RegisterRequest;
import com.example.cart.model.RefreshToken;
import com.example.cart.model.User;
import com.example.cart.repository.UserRepository;
import com.example.cart.security.JwtUtil;
import com.example.cart.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Value("${jwt.access-token-expiry-ms}")
    private int accessTokenExpiryMs;

    @Value("${jwt.refresh-token-expiry-ms}")
    private int refreshTokenExpiryMs;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRoles(Set.of("ROLE_USER"));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String accessToken = jwtUtil.generateAccessToken(user.getId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        setAccessTokenCookie(response, accessToken);
        setRefreshTokenCookie(response, refreshToken.getToken());

        return ResponseEntity.ok(new AuthResponse(user.getId(), user.getName(), user.getEmail(), "Login successful"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenStr = extractCookie(request, "refresh_token");
        if (refreshTokenStr == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No refresh token"));
        }

        try {
            RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr);
            refreshTokenService.verifyExpiration(refreshToken);

            String newAccessToken = jwtUtil.generateAccessToken(refreshToken.getUserId());
            setAccessTokenCookie(response, newAccessToken);

            return ResponseEntity.ok(Map.of("message", "Token refreshed"));
        } catch (RuntimeException e) {
            clearCookies(response);
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenStr = extractCookie(request, "refresh_token");
        if (refreshTokenStr != null) {
            try {
                RefreshToken rt = refreshTokenService.findByToken(refreshTokenStr);
                refreshTokenService.deleteByUserId(rt.getUserId());
            } catch (Exception ignored) {}
        }
        clearCookies(response);
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String accessToken = extractCookie(request, "access_token");
        if (accessToken == null || !jwtUtil.isValid(accessToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        String userId = jwtUtil.extractUserId(accessToken);
        return userRepository.findById(userId)
                .map(u -> ResponseEntity.ok(new AuthResponse(u.getId(), u.getName(), u.getEmail(), "ok")))
                .orElse(ResponseEntity.status(401).build());
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private void setAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set true in prod with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(accessTokenExpiryMs / 1000);
        response.addCookie(cookie);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set true in prod
        cookie.setPath("/api/auth");
        cookie.setMaxAge(refreshTokenExpiryMs / 1000);
        response.addCookie(cookie);
    }

    private void clearCookies(HttpServletResponse response) {
        Cookie ac = new Cookie("access_token", "");
        ac.setMaxAge(0); ac.setPath("/"); response.addCookie(ac);

        Cookie rc = new Cookie("refresh_token", "");
        rc.setMaxAge(0); rc.setPath("/api/auth"); response.addCookie(rc);
    }

    private String extractCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst().orElse(null);
    }
}
