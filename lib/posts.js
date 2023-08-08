import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd() , "posts");

export const getAllPostsData = () => {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map(fileName => {

        const id = fileName.replace(/\.md$/, '');

        const filePath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath);

        const matterResult = matter(fileContents);
        return {
            id,
            ...matterResult.data
        }
    })

    return allPostsData.sort((post1, post2) => {
        if(post1.date < post2.date) return 1
        else return -1
    });
}

export const getPostData = async (id) => {
    const fileName = id.concat('.md');
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath);
    const matterResult = matter(fileContents);

    const processedContent = await remark().use(html).process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data,
    }
}

export const getAllPostIds = () => {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return { 
            params: {
                id: fileName.replace(/\.md$/, '') 
            }
        }
    });
}
