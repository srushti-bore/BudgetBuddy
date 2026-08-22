package com.budgetbuddy.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI budgetBuddyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BudgetBuddy REST API")
                        .description("REST API documentation for BudgetBuddy Expense Tracker & Budgeting Application (V1-V3).")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("BudgetBuddy Team")
                                .email("support@budgetbuddy.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
