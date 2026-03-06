import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:5000/api/post",
    withCredentials: true
})

export async function getFeed(){
    const response = await api.get('/feed')
    return response.data;
}

export async function likePost(postId) {
    const response = await api.post(`/like/${postId}`);
    return response.data;
}

export async function createPost({ caption, imageFile }) {
    const formData = new FormData();
    formData.append("caption", caption ?? "");
    formData.append("Image", imageFile);

    const response = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}