const fs = require('fs');
const path = require('path');

const dirProjectPath = path.join(__dirname, 'project-dist');
const fileProjectHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
const fileProjectStylePath = path.join(__dirname, 'project-dist', 'style.css');
const fileProjectAssetsPath = path.join(__dirname, 'project-dist', 'assets');
const fileStylePath = path.join(__dirname, 'styles');
const fileTemplatePath = path.join(__dirname, 'template.html');
const fileComponentsPath = path.join(__dirname, 'components');
const fileAssetsPath = path.join(__dirname, 'assets');

function createProjectDir() {
  fs.mkdir(dirProjectPath, { recursive: true }, (err) => {
    if (err) {
      console.log('Error create dir "project-dist"');
    }
  });

  createFiles();
}

async function createFiles() {
  try {
    const templateContent = await fs.promises.readFile(
      fileTemplatePath,
      'utf-8',
    );
    const finalHtmlContent = await readAllFilesHtml(templateContent);
    await fs.promises.writeFile(fileProjectHtmlPath, finalHtmlContent, 'utf-8');

    const finalStyleContent = await readAllFilesStyle();
    await fs.promises.writeFile(
      fileProjectStylePath,
      finalStyleContent,
      'utf-8',
    );

    await copyDirrAssets();
  } catch (err) {
    console.error('Error write file:', err);
  }
}

async function copyDirrAssets() {
  try {
    await fs.promises.mkdir(fileProjectAssetsPath, { recursive: true });
    const dirs = await fs.promises.readdir(fileAssetsPath, {
      withFileTypes: true,
    });

    for (const dir of dirs) {
      const dirPath = path.join(fileAssetsPath, dir.name);
      const dirProjectPath = path.join(fileProjectAssetsPath, dir.name);

      if (dir.isDirectory()) {
        await copyDirectory(dirPath, dirProjectPath);
      } else if (dir.isFile()) {
        await fs.promises.copyFile(dirPath, dirProjectPath);
      }
    }
  } catch (err) {
    console.error('Error read all assets files:', err);
  }
}

async function copyDirectory(sourceDirPath, targetDirPath) {
  await fs.promises.mkdir(targetDirPath, { recursive: true });
  const dirs = await fs.promises.readdir(sourceDirPath, {
    withFileTypes: true,
  });

  for (const dir of dirs) {
    const sourcePath = path.join(sourceDirPath, dir.name);
    const targetPath = path.join(targetDirPath, dir.name);

    if (dir.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else if (dir.isFile()) {
      await fs.promises.copyFile(sourcePath, targetPath);
    }
  }
}

async function readAllFilesHtml(templateContent) {
  try {
    const files = await fs.promises.readdir(fileComponentsPath, {
      withFileTypes: true,
    });

    let templateContentNew = templateContent;

    for (const file of files) {
      if (file.isFile() && path.extname(file.name).slice(1) === 'html') {
        const filePath = path.join(fileComponentsPath, file.name);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const fileName = path.basename(file.name, path.extname(file.name));

        templateContentNew = templateContentNew.replace(
          `{{${fileName}}}`,
          fileContent,
        );
      }
    }
    return templateContentNew;
  } catch (err) {
    console.error('Error read all html files:', err);
  }
}

async function readAllFilesStyle() {
  try {
    const files = await fs.promises.readdir(fileStylePath, {
      withFileTypes: true,
    });

    let styleTemplateNew = '';

    for (const file of files) {
      if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
        const filePath = path.join(fileStylePath, file.name);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');

        styleTemplateNew += fileContent;
      }
    }
    return styleTemplateNew;
  } catch (err) {
    console.error('Error read all style files:', err);
  }
}

createProjectDir();
