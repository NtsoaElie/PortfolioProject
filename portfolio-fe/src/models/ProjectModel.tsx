export interface ProjectModel {
    projectId?: string | null; // Allows both undefined and null
    projectName: string;
    projectDescription: string;
    link: string;
}
