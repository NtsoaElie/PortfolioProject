package com.elie.portfolio_be.datalayer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String projectId;
    private String projectName;
    private String projectDescription;
    private String link;


    public Project(String projectId, String projectName, String projectDescription, String link) {
        this.projectId = UUID.randomUUID().toString();
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.link = link;
    }
}
