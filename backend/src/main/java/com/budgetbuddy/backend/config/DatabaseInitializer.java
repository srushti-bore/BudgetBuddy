package com.budgetbuddy.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * DatabaseInitializer manages optional local database auto-creation and runs
 * Flyway migrations safely on both local and cloud managed PostgreSQL instances.
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

    @Value("${app.db.auto-create:false}")
    private boolean autoCreateDb;

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            if (recreateDb || autoCreateDb) {
                try {
                    String cleanUrl = datasourceUrl.split("\\?")[0];
                    String dbName = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);
                    String hostPort = cleanUrl.replace("jdbc:postgresql://", "");
                    hostPort = hostPort.substring(0, hostPort.lastIndexOf('/'));

                    String maintenanceUrl = "jdbc:postgresql://" + hostPort + "/postgres";

                    if (recreateDb) {
                        log.info("`app.db.recreate` is TRUE. Dropping and re-creating database '{}'...", dbName);
                        dropAndCreateDatabase(maintenanceUrl, dbName);
                    } else if (autoCreateDb) {
                        createDatabaseIfNotExists(maintenanceUrl, dbName);
                    }
                } catch (Exception e) {
                    log.warn("Database auto-provisioning skipped (managed cloud database / connection pooler detected): {}", e.getMessage());
                }
            }

            log.info("Running Flyway migrations on connected database...");
            flyway.migrate();
            log.info("✅ Flyway migrations completed successfully.");
        };
    }

    private void dropAndCreateDatabase(String maintenanceUrl, String dbName) {
        try (Connection conn = DriverManager.getConnection(maintenanceUrl, username, password);
             Statement stmt = conn.createStatement()) {

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
            log.warn("Could not drop/create database '{}': {}", dbName, e.getMessage());
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
                log.info("Database '{}' already exists.", dbName);
            }
        } catch (Exception e) {
            log.warn("Could not verify/create database '{}': {}", dbName, e.getMessage());
        }
    }
}
