package com.budgetbuddy.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * DatabaseInitializer automatically manages the target database.
 * It connects to the maintenance "postgres" database using credentials
 * provided strictly via the .env file (injected by Spring @Value).
 *
 * If app.db.recreate is true, it drops the existing database and creates a fresh one.
 * Otherwise, it creates the database if it does not already exist.
 * Then Flyway executes all versioned SQL migrations (V1, V2, V3).
 */
@Slf4j
@Configuration
public class DatabaseInitializer {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${app.db.recreate:false}")
    private boolean recreateDb;

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            String dbName = extractDatabaseName(datasourceUrl);
            String host = extractHostPort(datasourceUrl);

            String maintenanceUrl = "jdbc:postgresql://" + host + "/postgres";
            
            if (recreateDb) {
                log.info("`app.db.recreate` is set to TRUE. Dropping and re-creating database '{}'...", dbName);
                dropAndCreateDatabase(maintenanceUrl, dbName);
            } else {
                createDatabaseIfNotExists(maintenanceUrl, dbName);
            }

            log.info("Running Flyway migrations on database '{}'...", dbName);
            flyway.migrate();
        };
    }

    private void dropAndCreateDatabase(String maintenanceUrl, String dbName) {
        try (Connection conn = DriverManager.getConnection(maintenanceUrl, username, password);
             Statement stmt = conn.createStatement()) {

            // Terminate open connections to the target DB before dropping
            stmt.executeUpdate(
                "SELECT pg_terminate_backend(pg_stat_activity.pid) " +
                "FROM pg_stat_activity " +
                "WHERE pg_stat_activity.datname = '" + dbName + "' " +
                "AND pid <> pg_backend_pid()"
            );

            log.info("Dropping existing database '{}'...", dbName);
            stmt.executeUpdate("DROP DATABASE IF EXISTS \"" + dbName + "\"");
            
            log.info("Creating fresh database '{}'...", dbName);
            stmt.executeUpdate("CREATE DATABASE \"" + dbName + "\"");
            log.info("✅ Database '{}' recreated successfully.", dbName);
        } catch (Exception e) {
            log.error("Failed to recreate database '{}': {}", dbName, e.getMessage());
            throw new RuntimeException("Could not recreate database: " + e.getMessage(), e);
        }
    }

    private void createDatabaseIfNotExists(String maintenanceUrl, String dbName) {
        try (Connection conn = DriverManager.getConnection(maintenanceUrl, username, password);
             Statement stmt = conn.createStatement()) {

            ResultSet rs = stmt.executeQuery(
                "SELECT 1 FROM pg_database WHERE datname = '" + dbName + "'"
            );

            if (!rs.next()) {
                log.info("Database '{}' not found. Creating it automatically...", dbName);
                stmt.executeUpdate("CREATE DATABASE \"" + dbName + "\"");
                log.info("✅ Database '{}' created successfully.", dbName);
            } else {
                log.info("Database '{}' already exists. Skipping creation.", dbName);
            }
        } catch (Exception e) {
            log.error("Failed to ensure database '{}' exists: {}", dbName, e.getMessage());
            throw new RuntimeException("Could not initialize database: " + e.getMessage(), e);
        }
    }

    private String extractDatabaseName(String jdbcUrl) {
        return jdbcUrl.substring(jdbcUrl.lastIndexOf('/') + 1);
    }

    private String extractHostPort(String jdbcUrl) {
        String withoutScheme = jdbcUrl.replace("jdbc:postgresql://", "");
        return withoutScheme.substring(0, withoutScheme.lastIndexOf('/'));
    }
}
