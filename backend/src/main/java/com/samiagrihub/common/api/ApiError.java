package com.samiagrihub.common.api;

public record ApiError(
        String code,
        String message
) {
}
