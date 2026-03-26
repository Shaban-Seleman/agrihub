package com.samiagrihub.user.dto;

public record ProfileCompletionResponse(
        int percentage,
        boolean sharedProfileComplete,
        boolean roleProfileComplete,
        boolean cropSelectionsComplete
) {
}
