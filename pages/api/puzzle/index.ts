import dbConnect from 'libs/db/mongoose';
import Puzzle from 'models/Puzzle';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  item?: any;
  message: string;
  error?: any;
  page?: number;
  isLast?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'POST') {
    try {
      const puzzle = new Puzzle(req.body.data);
      puzzle.save((err: any, doc: any) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'failed', error: err });
        }
        res.status(201).json({ item: doc, message: 'success' });
      });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
  if (method === 'GET') {
    const { page } = req.query;
    try {
      const limit = 8;
      const puzzle = await Puzzle.find({ secretRoom: false })
        .where('perfection')
        .ne(1)
        .sort({
          createdAt: -1,
        })
        .skip((Number(page) - 1) * limit)
        .limit(limit);
      const totalCount = await Puzzle.count({ secretRoom: false });
      const totalPage = Math.ceil(totalCount / limit);
      const isLast = totalPage === Number(page) || totalCount === 0;
      res.status(201).json({ item: puzzle, message: 'success', page: Number(page), isLast });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}
