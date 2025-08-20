export default class BalanceService
{
    async getJsonResource(url: string): Promise<any> {
        const res: Response = await fetch(url, {
            headers: {
                'Content-Type': "application/json; origin"
            }
        });

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`)
        }

        return await res.json();
    }
}
