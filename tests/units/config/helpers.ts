import * as mocha from 'mocha';
import * as Chai from 'chai';
import * as td from 'testdouble';
const supertest = require('supertest');

const request = supertest;
const expect = Chai.expect;
const testDouble = td;

export {expect, request, testDouble};
