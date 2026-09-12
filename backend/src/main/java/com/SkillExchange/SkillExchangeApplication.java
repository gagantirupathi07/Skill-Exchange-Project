package com.SkillExchange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SkillExchangeApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                SkillExchangeApplication.class,
                args
        );

        System.out.println("Skill Exchange Application Started");
    }
}