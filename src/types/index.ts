export type FileNodeType = 'file' | 'folder'

export interface FileNode {
  name: string
  path: string
  type: FileNodeType
  children?: FileNode[]
}

export interface Note {
  path: string
  content: string
  sha: string
  lastModified?: string
}

export interface GitHubUser {
  id: number
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  private: boolean
  description: string | null
  default_branch: string
}

export interface SaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error'
  message?: string
}
