const LANGUAGES = [
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "java", name: "Java" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "ruby", name: "Ruby" },
  { id: "php", name: "PHP" },
  { id: "r", name: "R" },
  { id: "perl", name: "Perl" },
  { id: "dart", name: "Dart" },
  { id: "lua", name: "Lua" },
  { id: "scala", name: "Scala" },
];

const MONACO_LANGUAGE_MAP = {
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  java: "java",
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  go: "go",
  rust: "rust",
  swift: "swift",
  kotlin: "kotlin",
  ruby: "ruby",
  php: "php",
  r: "r",
  perl: "perl",
  dart: "dart",
  lua: "lua",
  scala: "scala",
};

const STARTER_CODE = {
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  python: `print("Hello, World!")`,
  javascript: `console.log("Hello, World!");`,
  typescript: `const greeting: string = "Hello, World!";\nconsole.log(greeting);`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  rust: `fn main() {\n    println!("Hello, World!");\n}`,
  swift: `import Foundation\n\nprint("Hello, World!")`,
  kotlin: `fun main() {\n    println("Hello, World!")\n}`,
  ruby: `puts "Hello, World!"`,
  php: `<?php\necho "Hello, World!\\n";`,
  r: `cat("Hello, World!\\n")`,
  perl: `print "Hello, World!\\n";`,
  dart: `void main() {\n  print("Hello, World!");\n}`,
  lua: `print("Hello, World!")`,
  scala: `object Main extends App {\n  println("Hello, World!")\n}`,
};

const detectLanguage = (code) => {
  const patterns = [
    { id: "python", tests: [/^import /, /^from /, /def \w+\(/, /print\(/, /if __name__/, /:\s*$/m] },
    { id: "javascript", tests: [/=>/, /console\.log/, /const .* = require\(/, /module\.exports/, /function .*\(.*\)\s*\{/] },
    { id: "typescript", tests: [/:\s*(string|number|boolean|void|any|interface|type)\b/, /<[A-Z]\w*>/] },
    { id: "java", tests: [/public (class|static|void)/, /System\.(out|err)\./, /protected |private /] },
    { id: "go", tests: [/package main/, /func main\(\)/, /fmt\./, /import "fmt"/] },
    { id: "rust", tests: [/fn main\(\)/, /println!\(/, /let mut /, /impl /] },
    { id: "cpp", tests: [/iostream/, /cout\s*<</, /#include <[^h]>/, /std::/] },
    { id: "c", tests: [/^#include <stdio/, /printf\(/, /int main\(/] },
    { id: "csharp", tests: [/using System/, /Console\./, /namespace /, /class .* \{/] },
    { id: "swift", tests: [/import (Foundation|UIKit)/, /func \w+\(/, /print\(/] },
    { id: "kotlin", tests: [/fun main/, /println\(/, /var |val /] },
    { id: "ruby", tests: [/def \w+/, /puts /, /end\s*$/, /require '/] },
    { id: "php", tests: [/^<\?php/, /\$[a-zA-Z_]/, /echo /] },
    { id: "r", tests: [/^library\(/, /<- /, /#>/] },
    { id: "perl", tests: [/^use strict/, /my \$/, /print "/] },
    { id: "dart", tests: [/void main/, /print\(/, /import 'package:/] },
    { id: "lua", tests: [/^function /, /local /, /end\s*$/m] },
    { id: "scala", tests: [/object Main/, /extends App/, /println\(/] },
  ];

  const lines = code.trim().split("\n");
  const scores = patterns.map(({ id, tests }) => ({
    id,
    score: tests.filter((t) => t.test(code) || lines.some((l) => t.test(l))).length,
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score > 0 ? scores[0].id : null;
};

export { LANGUAGES, MONACO_LANGUAGE_MAP, STARTER_CODE, detectLanguage };
