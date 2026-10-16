import { test, expect } from '@fixtures/testFixtures';
import { knownBooks } from '@core/constants/books';
import { expectBookIsPresent } from '@core/utils/assertions';
import { env } from '@config/env';
import { CreateUserResponse, NotFound } from '@core/api/accountApi';
import statuses from "@core/constants/statuses.json"



  test('should retrieve statuses from json',
    async ({  }) => {
       console.log(`message when not found: ${JSON.stringify(statuses.STATUSCODES)}`);
       console.log(`status code for validation error: ${statuses.STATUSCODES.validationError}`)
    });

