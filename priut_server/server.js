
const http = require('http'); 
const fs = require('fs').promises; 
const path = require('path');

const PORT = 3000; 
const aboutUsData = {
    title: "Наша миссия и история",
    paragraphs: [
        "Приют 'Теремок' был основан в 2015 году группой единомышленников, которые объединились с одной целью — помогать бездомным животным обрести любящий дом.",
        "Мы верим, что каждое животное заслуживает теплоты, заботы и безопасного убежища. Ежедневно наши волонтеры и сотрудники работают над тем, чтобы обеспечить нашим подопечным наилучшие условия содержания, медицинскую помощь и социализацию.",
        "За годы работы мы нашли дом для сотен собак и кошек, и мы не остановимся, пока каждый хвостик не найдет свою семью. Присоединяйтесь к нам и помогите сделать мир лучше для наших четвероногих друзей!"
    ],
    foundingYear: 2015,
    missionStatement: "Помогать бездомным животным обрести любящий дом и обеспечить им достойную жизнь."
};

const parseMultipartFormData = (buffer, boundary) => {
    const parts = [];
    const lines = buffer.toString('binary').split(`--${boundary}`);
    for (let i = 1; i < lines.length - 1; i++) {
        const part = lines[i];
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;

        const headers = part.substring(0, headerEnd);
        const body = part.substring(headerEnd + 4);
        const contentDispositionMatch = headers.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]+)")?/i);
        if (!contentDispositionMatch) continue;

        const name = contentDispositionMatch[1]; 
        const filename = contentDispositionMatch[2]; 

        if (filename) {
            const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/i);
            const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
            parts.push({
                name,
                filename,
                contentType,
                data: Buffer.from(body.trim(), 'binary') 
            });
        } else {
            parts.push({
                name,
                value: body.trim() 
            });
        }
    }
    return parts;
};

const server = http.createServer(async (req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/api/aboutus') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(aboutUsData)); 
        return; 
    }
    if (req.method === 'POST' && req.url === '/api/contact') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', async () => { 
            const buffer = Buffer.concat(body);
            const contentTypeHeader = req.headers['content-type'];

            if (!contentTypeHeader || !contentTypeHeader.includes('multipart/form-data')) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Ожидается Content-Type: multipart/form-data.' }));
                return;
            }

            const boundaryMatch = contentTypeHeader.match(/boundary=([^;]+)/);
            if (!boundaryMatch) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Boundary не найден в заголовке Content-Type.' }));
                return;
            }
            const boundary = boundaryMatch[1];

            const parts = parseMultipartFormData(buffer, boundary);
            let name, email, message, fileData = null;

            parts.forEach(part => {
                if (part.name === 'name') name = part.value;
                if (part.name === 'email') email = part.value;
                if (part.name === 'message') message = part.value;
                if (part.name === 'file' && part.filename) fileData = part;
            });

            if (!name || !email || !message) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Пожалуйста, заполните все обязательные поля: имя, email, сообщение.' }));
                return;
            }
            const timestamp = new Date().toISOString();
            let logMessage = `--- Запись от ${timestamp} ---\n`;
            logMessage += `Имя: ${name}\n`;
            logMessage += `Email: ${email}\n`;
            logMessage += `Сообщение:\n${message}\n`;

            if (fileData) {
                const uploadDir = path.join(__dirname, 'uploads');

                try {
                    await fs.mkdir(uploadDir, { recursive: true });

                    const filePath = path.join(uploadDir, `${timestamp}-${fileData.filename}`);
                    await fs.writeFile(filePath, fileData.data); 

                    logMessage += `Файл сохранен: ${filePath}\n`;
                    console.log(`Файл ${fileData.filename} успешно сохранен в ${filePath}`);

                } catch (err) {
                    console.error('Ошибка при сохранении файла:', err);
                    logMessage += `(Ошибка при сохранении файла: ${fileData.filename})\n`;
                }
            } else {
                logMessage += `Файл не прикреплен.\n`;
            }
            logMessage += `---\n\n`;

            try {
                await fs.appendFile('form_submissions.log', logMessage); 
                console.log('Данные формы и/или файл успешно получены и записаны.');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Сообщение успешно получено и сохранено!' }));
            } catch (err) {
                console.error('Ошибка при записи в лог-файл:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Ошибка сервера при сохранении данных.' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Эндпоинт не найден или метод не разрешен.' }));
    }
});

server.listen(PORT, () => {
    console.log(`Сервер бэкенда запущен по адресу: http://localhost:${PORT}`);
    console.log('Ожидает POST запросы на эндпоинт: /api/contact');
    console.log('Ожидает GET запросы на эндпоинт: /api/aboutus');
    console.log('Данные формы будут сохраняться в файл: form_submissions.log');
    console.log('Прикрепленные файлы будут сохраняться в папку: uploads/');
});