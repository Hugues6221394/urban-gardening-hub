package com.urbangardeninghub.dto;

import com.urbangardeninghub.entity.User;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
