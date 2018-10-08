import { TestBed } from '@angular/core/testing';

import { ImageUploadS3Service } from './image-upload-s3.service';

describe('ImageUploadS3Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageUploadS3Service = TestBed.get(ImageUploadS3Service);
    expect(service).toBeTruthy();
  });
});
