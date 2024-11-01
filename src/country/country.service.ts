import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CountryService {
  private nagerUrl = 'https://date.nager.at/api/v3';
  private countriesNowUrl = 'https://countriesnow.space/api/v0.1';

  async getAvailableCountries() {
    try {
      const { data } = await axios.get(`${this.nagerUrl}/AvailableCountries`);
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch available countries',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCountryInfo(countryCode: string) {
    try {
      const { data: borderData } = await axios.get(
        `${this.nagerUrl}/CountryInfo/${countryCode}`,
      );
      const borderCountries = borderData?.borders || [];

      const { data: populationData } = await axios.post(
        `${this.countriesNowUrl}/countries/population`,
        {
          country: borderData.commonName,
        },
      );
      const population = populationData.data?.populationCounts || [];

      const { data: flagData } = await axios.post(
        `${this.countriesNowUrl}/countries/flag/images`,
        {
          country: borderData.commonName,
        },
      );
      const flagUrl = flagData.data?.flag || '';

      return {
        name: borderData.commonName,
        borders: borderCountries,
        population,
        flagUrl,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Failed to fetch country info',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
