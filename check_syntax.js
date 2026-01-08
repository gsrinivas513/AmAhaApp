const fs = require('fs');
const parser = require('@babel/parser');

try {
  const code = fs.readFileSync('src/quiz/components/QuizBuilder.jsx', 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('✅ Syntax is valid');
} catch(e) {
  console.log('❌ Syntax error:');
  console.log(`Location: Line ${e.loc?.line}, Column ${e.loc?.column}`);
  console.log(`Error: ${e.message}`);
  
  // Show context around error
  const lines = fs.readFileSync('src/quiz/components/QuizBuilder.jsx', 'utf8').split('\n');
  const errorLine = e.loc?.line;
  if (errorLine) {
    console.log(`\nContext:`);
    for (let i = Math.max(0, errorLine - 3); i < Math.min(lines.length, errorLine + 2); i++) {
      const marker = i === errorLine - 1 ? '>>> ' : '    ';
      console.log(`${marker}${i+1}: ${lines[i]}`);
    }
  }
}
