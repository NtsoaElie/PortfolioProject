package com.elie.portfolio_be.businesslayer;

import com.elie.portfolio_be.presentationlayer.ProjectRequestModel;
import com.elie.portfolio_be.presentationlayer.ProjectResponseModel;

import java.util.List;

public interface ProjectService {
    List<ProjectResponseModel> getAllProjects();
    ProjectResponseModel getProjectById(String projectId);
    ProjectResponseModel createProject(ProjectRequestModel projectRequest);
    ProjectResponseModel updateProject(String projectId, ProjectRequestModel projectRequest);
    void deleteProject(String projectId);
}
