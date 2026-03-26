package com.samiagrihub.common.security;

import com.samiagrihub.common.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    public JwtTokenService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.jwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(AppUserPrincipal principal) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(jwtProperties.accessTokenMinutes() * 60);
        return Jwts.builder()
                .subject(String.valueOf(principal.getUserId()))
                .claim("phoneNumber", principal.getPhoneNumber())
                .claim("accountType", principal.getAccountType().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(secretKey)
                .compact();
    }

    public AppUserPrincipal parseToken(String token) {
        Claims claims = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
        return AppUserPrincipal.builder()
                .userId(Long.parseLong(claims.getSubject()))
                .phoneNumber(claims.get("phoneNumber", String.class))
                .accountType(Enum.valueOf(com.samiagrihub.user.entity.AccountType.class, claims.get("accountType", String.class)))
                .build();
    }
}
