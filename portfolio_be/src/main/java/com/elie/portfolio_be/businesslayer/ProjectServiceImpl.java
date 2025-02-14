package com.elie.portfolio_be.businesslayer;

import com.elie.portfolio_be.datalayer.Project;
import com.elie.portfolio_be.datalayer.ProjectRepository;
import com.elie.portfolio_be.presentationlayer.ProjectRequestModel;
import com.elie.portfolio_be.presentationlayer.ProjectResponseModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    @Override
    public List<ProjectResponseModel> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toResponseModel)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponseModel getProjectById(String projectId) {
        return projectRepository.findByProjectId(projectId)
                .map(this::toResponseModel)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public ProjectResponseModel createProject(ProjectRequestModel projectRequest) {
        Project project = new Project();
        project.setProjectId(UUID.randomUUID().toString());
        project.setProjectName(projectRequest.getProjectName());
        project.setProjectDescription(projectRequest.getProjectDescription());
        project.setLink(projectRequest.getLink());

        Project savedProject = projectRepository.save(project);
        return toResponseModel(savedProject);
    }

    @Override
    public ProjectResponseModel updateProject(String projectId, ProjectRequestModel projectRequest) {
        Project project = projectRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        project.setProjectName(projectRequest.getProjectName());
        project.setProjectDescription(projectRequest.getProjectDescription());
        project.setLink(projectRequest.getLink());

        Project updatedProject = projectRepository.save(project);
        return toResponseModel(updatedProject);
    }

    @Override
    public void deleteProject(String projectId) {
        Project project = projectRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        projectRepository.delete(project);

    }

    private ProjectResponseModel toResponseModel(Project project) {
        return new ProjectResponseModel(
                project.getProjectId(),
                project.getProjectName(),
                project.getProjectDescription(),
                project.getLink()
        );
    }
}
