export default async function ServerLayout(){
    const data = await fetch('https://jsonplaceholder.typicode.com/posts/1').then(res => res.json());
    return (
        <p>서버에서 가져온 제목 : {data.title}</p>
    );
}