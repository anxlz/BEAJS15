import type { Request } from "express";
import multer, { diskStorage, memoryStorage } from "multer";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { StorageApproachEnum } from "../../enum/index.js";
import { BadRequestException } from "../../exception/index.js";

export const cloudFileUpload = ({
    storageApproach = StorageApproachEnum.MEMORY,
    validation = [],
    maxSize = 2
}: {
    storageApproach?: StorageApproachEnum;
    validation?: string[];
    maxSize?: number;
}) => {
    const storage =
        storageApproach === StorageApproachEnum.DISK
            ? diskStorage({
                  destination: tmpdir(),
                  filename: (req: Request, file, callback) => {
                      callback(null, `${randomUUID()}__${file.originalname}`);
                  }
              })
            : memoryStorage();

    const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
        if (!validation.includes(file.mimetype)) {
            return callback(new BadRequestException("Invalid file format"));
        }
        callback(null, true);
    };

    return multer({ storage, fileFilter, limits: { fileSize: maxSize * 1024 * 1024 } });
};
