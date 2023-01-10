import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.create({
        title: 'testMovie',
        genres: ['test'],
        year: 2022,
      });

      const movie = service.getOne(1);

      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('show throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie with ID 999 not found.');
      }
    });
  });

  describe('deleteOne()', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'testMovie',
        genres: ['test'],
        year: 2022,
      });

      const beforeDelete = service.getAll().length;

      service.deleteOne(1);

      const afterDelete = service.getAll().length;

      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('show throw 404 error', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie with ID 999 not found.');
      }
    });

    describe('create()', () => {
      it('should create movie', () => {
        const beforeCreate = service.getAll().length;

        service.create({
          title: 'testMovie',
          genres: ['test'],
          year: 2022,
        });

        const afterCreate = service.getAll().length;

        expect(afterCreate).toBeGreaterThan(beforeCreate);
        console.log(beforeCreate, afterCreate);
      });
    });

    describe('update()', () => {
      it('should update movie', () => {
        service.create({
          title: 'testMovie',
          genres: ['test'],
          year: 2022,
        });

        service.update(1, {
          title: 'updatedMovie',
        });

        const movie = service.getOne(1);
        expect(movie.title).toEqual('updatedMovie');
      });
      it('show throw a NotFoundException', () => {
        try {
          service.update(999, {});
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual('Movie with ID 999 not found.');
        }
      });
    });
  });
});
