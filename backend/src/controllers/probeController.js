import { probeUrl, ProbeError } from "../probe/index.js";

export async function probe(req, res) {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: "url is required"});
    }

    try {
        const result = await probeUrl(url);
        res.json(result);
    } catch (error) {
        if (error instanceof ProbeError) {
            return res.status(422).json({
                message: error.message,
                code: error.code,
            });
        }
        throw error;
    }
}