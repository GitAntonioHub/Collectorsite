package com.Collectorsite.Backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}

@Component
class DatabaseSchemaInspector {
    private final DataSource dataSource;

    public DatabaseSchemaInspector(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void inspectDatabaseSchema() {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            
            System.out.println("\n\n==== DATABASE TABLE INSPECTION ====");
            
            // Get all tables
            ResultSet tables = metaData.getTables(null, null, "%", new String[]{"TABLE"});
            System.out.println("All tables in the database:");
            while (tables.next()) {
                String tableName = tables.getString("TABLE_NAME");
                if (!tableName.startsWith("pg_") && !tableName.startsWith("sql_")) {
                    System.out.println("- " + tableName);
                }
            }
            
            // Get foreign keys for verification_request
            System.out.println("\nForeign keys for verification_request table:");
            ResultSet foreignKeys = metaData.getImportedKeys(null, null, "verification_request");
            while (foreignKeys.next()) {
                String pkTableName = foreignKeys.getString("PKTABLE_NAME");
                String pkColumnName = foreignKeys.getString("PKCOLUMN_NAME");
                String fkColumnName = foreignKeys.getString("FKCOLUMN_NAME");
                String fkName = foreignKeys.getString("FK_NAME");
                System.out.println("FK: " + fkName + " -> " + fkColumnName + " references " + pkTableName + "(" + pkColumnName + ")");
            }
            
            System.out.println("==== END OF DATABASE INSPECTION ====\n\n");
        } catch (SQLException e) {
            System.err.println("Error inspecting database schema: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
