import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Tile } from './Tile';
import { MapService } from '../services/map.service';
import { TileType } from './TileType';
import { TileState } from './TileState';
import { Snobee } from './Snobee';
import { SubjectContainerService } from '../services/subject-container.service';

describe('Snobee', () => {
    let MockMapService: MapService;
    let MockSubjectContainer: SubjectContainerService;

    beforeEach(() => {
        MockMapService = new MapService();
        MockMapService.mapGenerationSpeed = 1;
        MockMapService.GenerateNewMap(10, 10);
        MockSubjectContainer = new SubjectContainerService();
        TestBed.configureTestingModule({
            providers: [{ provide: MapService, useValue: MockMapService }]
        });
    });

    describe("InteractLeft", () => {
        it('should not move on diamond block', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);

            MockMapService.GetTileByIndex(2, 3).TileType = TileType.DiamondBlock;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractLeft()).toBeFalsy();
        });

        it('should not move as edge of map', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            snobee.Location = { Column: 0, Row: 3 };
            expect(snobee.InteractLeft()).toBeFalsy();
        });

        it('should move', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            MockMapService.GetTileByIndex(2, 3).TileType = TileType.Floor;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractLeft()).toBeTruthy();
            expect(snobee.Location.Column).toEqual(2);
        });
    });


    describe("InteractRight", () => {
        it('should not move on diamond block', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);

            MockMapService.GetTileByIndex(4, 3).TileType = TileType.DiamondBlock;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractRight()).toBeFalsy();
        });

        it('should not move as edge of map', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            snobee.Location = { Column: 9, Row: 3 };
            expect(snobee.InteractRight()).toBeFalsy();
        });

        it('should move', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            MockMapService.GetTileByIndex(4, 3).TileType = TileType.Floor;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractRight()).toBeTruthy();
            expect(snobee.Location.Column).toEqual(4);
        });
    });

    describe("InteractUp", () => {
        it('should not move on diamond block', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);

            MockMapService.GetTileByIndex(3, 2).TileType = TileType.DiamondBlock;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractUp()).toBeFalsy();
        });

        it('should not move as edge of map', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            snobee.Location = { Column: 3, Row: 0 };
            expect(snobee.InteractUp()).toBeFalsy();
        });

        it('should move', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            MockMapService.GetTileByIndex(3, 2).TileType = TileType.Floor;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractUp()).toBeTruthy();
            expect(snobee.Location.Row).toEqual(2);
        });
    });

    describe("InteractDown", () => {
        it('should not move on diamond block', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);

            MockMapService.GetTileByIndex(3, 4).TileType = TileType.DiamondBlock;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractDown()).toBeFalsy();
        });

        it('should not move as edge of map', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            snobee.Location = { Column: 3, Row: 9 };
            expect(snobee.InteractDown()).toBeFalsy();
        });

        it('should move', () => {
            var snobee = new Snobee(MockMapService, MockSubjectContainer);
            MockMapService.GetTileByIndex(3, 4).TileType = TileType.Floor;
            snobee.Location = { Column: 3, Row: 3 };
            expect(snobee.InteractDown()).toBeTruthy();
            expect(snobee.Location.Row).toEqual(4);
        });
    });
});