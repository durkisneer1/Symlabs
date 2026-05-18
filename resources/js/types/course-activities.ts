export type CourseActivity =
  | QuickCheckActivity
  | FileTreeActivity
  | CodeFlowActivity
  | CssPlaygroundActivity
  | HtmlPlaygroundActivity
  | RecapActivity;

export type QuickCheckActivity = {
  type: 'quick-check';
  title: string;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type FileTreeActivity = {
  type: 'file-tree';
  title: string;
  description: string;
  root: FileTreeNode;
};

export type FileTreeNode = {
  name: string;
  kind: 'file' | 'folder';
  note?: string;
  children?: FileTreeNode[];
};

export type CodeFlowActivity = {
  type: 'code-flow';
  title: string;
  description: string;
  steps: Array<{
    label: string;
    code: string;
    note: string;
    memory: Array<{
      name: string;
      value: string;
    }>;
    output?: string;
  }>;
};

export type CssPlaygroundActivity = {
  type: 'css-playground';
  title: string;
  prompt: string;
  starter: string;
  allowedProperties: string[];
  target: string;
  success: string;
};

export type HtmlPlaygroundActivity = {
  type: 'html-playground';
  title: string;
  prompt: string;
  starter: string;
  answerIncludes: string[];
  success: string;
};

export type RecapActivity = {
  type: 'recap';
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};
