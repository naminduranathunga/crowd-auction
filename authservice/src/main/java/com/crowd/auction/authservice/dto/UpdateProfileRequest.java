package com.crowd.auction.authservice.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.crowd.auction.authservice.model.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;

    @Email(message = "Email should be valid")
    private String email;

    private String password;
    private Role role;
}
