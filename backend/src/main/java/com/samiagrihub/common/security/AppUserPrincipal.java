package com.samiagrihub.common.security;

import com.samiagrihub.user.entity.AccountType;
import java.util.Collection;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Getter
@Builder
public class AppUserPrincipal {
    private Long userId;
    private String phoneNumber;
    private AccountType accountType;

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + accountType.name()));
    }
}
