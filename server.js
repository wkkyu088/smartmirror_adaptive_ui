const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3001;

app.get('/data', (req, res) => {
  // test.py 실행
  console.log('test.py 실행')
  const pythonProcess = spawn('python', ['test.py']);

  // test.py의 출력값을 받음
  pythonProcess.stdout.on('data', (data) => {
    console.log('test.py의 출력값을 받음')
    const message = data.toString().trim();
    res.send(message);
  });

  // test.py 실행 중 오류 발생 시 처리
  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
    res.status(500).send('An error occurred');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
