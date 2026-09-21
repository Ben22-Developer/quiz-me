export default async function responseExtract (response)
{

    const responseContentType = response.headers.get("content-type");

    if (responseContentType == null)
        return "";

    if (responseContentType.includes("text"))
        return await response.text();

    return await response.json();
}