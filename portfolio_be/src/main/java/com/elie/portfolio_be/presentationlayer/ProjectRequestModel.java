package com.elie.portfolio_be.presentationlayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequestModel {

    private String projectName;
    private String projectDescription;
    private String link;
}
