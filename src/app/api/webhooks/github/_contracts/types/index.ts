export enum GitHubEvent {
  PullRequest = 'pull_request',
  PullRequestReview = 'pull_request_review',
  PullRequestReviewComment = 'pull_request_review_comment',
  Push = 'push',
  Issues = 'issues',
  IssueComment = 'issue_comment',
}

export type GitHubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User' | 'Bot' | string;
  user_view_type: string;
  site_admin: boolean;
};

export type GitHubLicense = {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
  node_id: string;
};

export type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: GitHubLicense | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  visibility: 'public' | 'private' | string;
  default_branch: string;
};

export type GitHubPullRequestRef = {
  label: string;
  ref: string;
  sha: string;
  user: GitHubUser;
  repo: GitHubRepository;
};

export enum GitHubPullRequestState {
  Open = 'open',
  Closed = 'closed',
  Merged = 'merged',
}

export type GitHubPullRequest = {
  id: number;
  node_id: string;
  number: number;
  state: GitHubPullRequestState;
  locked: boolean;
  title: string;
  body: string | null;
  user: GitHubUser;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: GitHubUser | null;
  assignees: GitHubUser[];
  requested_reviewers: GitHubUser[];
  //   labels: any[];
  //   milestone: any | null;
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  comments_url: string;
  statuses_url: string;
  head: GitHubPullRequestRef;
  base: GitHubPullRequestRef;
  author_association: string;
  //   auto_merge: any | null;
  active_lock_reason: string | null;
};

export enum GitHubReviewState {
  Approved = 'approved',
  ChangesRequested = 'changes_requested',
  Commented = 'commented',
  Dismissed = 'dismissed',
}

export type GitHubPullRequestReview = {
  id: number;
  node_id: string;
  user: GitHubUser;
  body: string | null;
  commit_id: string;
  submitted_at: string;
  state: GitHubReviewState;
  html_url: string;
  pull_request_url: string;
  updated_at: string;
  author_association: string;
};

export type PullRequestReviewWebhookPayload = {
  action: 'submitted' | 'edited' | 'dismissed' | string;
  review: GitHubPullRequestReview;
  pull_request: GitHubPullRequest;
  repository: GitHubRepository;
  sender: GitHubUser;
};
