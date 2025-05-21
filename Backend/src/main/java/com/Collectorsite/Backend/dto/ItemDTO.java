package com.Collectorsite.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.UUID;
import com.Collectorsite.Backend.enums.*;
import java.time.Year;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItemDTO {
    private UUID id;
    
    private UUID ownerId;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 150, message = "Title must be between 3 and 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    private ItemCondition condition;

    @Min(value = 1800, message = "Year must be 1800 or later")
    @Max(value = 2100, message = "Year cannot be more than 2100")
    private Integer year;

    @Min(value = 0, message = "Estimated value must be positive")
    private Double estimatedValue;

    private ItemStatus status;
}
