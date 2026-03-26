package com.samiagrihub.common.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public void check(String key, long capacity, Duration duration) {
        Bucket bucket = buckets.computeIfAbsent(key, ignored -> Bucket.builder()
                .addLimit(Bandwidth.classic(capacity, Refill.greedy(capacity, duration)))
                .build());
        if (!bucket.tryConsume(1)) {
            throw new com.samiagrihub.common.exception.AppException(
                    "RATE_LIMITED", "Too many requests. Please try again later.", org.springframework.http.HttpStatus.TOO_MANY_REQUESTS);
        }
    }

    public BucketConfiguration configuration(long capacity, Duration duration) {
        return BucketConfiguration.builder()
                .addLimit(Bandwidth.classic(capacity, Refill.greedy(capacity, duration)))
                .build();
    }
}
