package com.urbangardeninghub.dto;

import com.urbangardeninghub.entity.User;
import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private User.UserType userType;
}