export const createForm = (code: number, username: string) => {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Код регистрации</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    h1 {
      color: #333;
      text-align: center;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
    }
    
    .code {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 10px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    
    .signature {
      text-align: center;
      margin-top: 30px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Код регистрации</h1>
    <p>Здравствуйте, ${username}</p>
    <p>Ваш код регистрации:</p>
    <div class="code">${code}</div>
    <p>С уважением, Ivan</p>
    <p class="signature">команда SberTube</p>
  </div>
</body>
</html>`;
};
