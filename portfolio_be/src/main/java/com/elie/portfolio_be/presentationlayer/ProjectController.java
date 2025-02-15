package com.elie.portfolio_be.presentationlayer;

import com.elie.portfolio_be.businesslayer.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponseModel> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponseModel> getProjectById(@PathVariable String projectId){
        return ResponseEntity.status(HttpStatus.OK).body(projectService.getProjectById(projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponseModel> createProject(@RequestBody ProjectRequestModel projectRequestModel){
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(projectRequestModel));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponseModel> updateProject(@RequestBody ProjectRequestModel projectRequestModel, @PathVariable String projectId){
        return ResponseEntity.status(HttpStatus.OK).body(projectService.updateProject(projectId, projectRequestModel));
    }

    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable String projectId){
        projectService.deleteProject(projectId);
    }
}
