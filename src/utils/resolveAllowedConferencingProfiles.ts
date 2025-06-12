interface ConferencingProfile {
  provider_name: keyof typeof MapProfileNameToConferencingProfile;
  profile_id: string;
}

interface MapProfileNameToConferencingProfileType {
  [key: string]: string;
}

interface ConferencingIntegrationLogosType {
  [key: string]: string;
}
export const MapProfileNameToConferencingProfile = {
  google: 'Google Meet',
  zoom: 'Zoom',
  exchange: 'Microsoft Teams',
};

export const ConferencingIntegrationLogos = {
  google: 'google_meet',
  zoom: 'Zoom',
  exchange: 'microsoft_teams',
};

type ResolveAllowedConferencingOptionsParams = {
  conferencingProfiles: ConferencingProfile[];
  serviceHasCustomLink?: boolean;
  serviceCustomLink?: string;
  displayCustomLink?: boolean;
};

type Option = {
  value: string;
  img: string;
  label: string;
};
export const resolveAllowedConferencingOptions = ({
  conferencingProfiles,
  serviceHasCustomLink = false,
  serviceCustomLink,
}: ResolveAllowedConferencingOptionsParams) => {
  const customLinkOption = {
    label: 'Custom Link',
  };

  if (!conferencingProfiles || conferencingProfiles.length === 0) {
    return [];
  }

  const options = conferencingProfiles.map(profile => {
    const label = MapProfileNameToConferencingProfile[profile.provider_name] || 'Unknown Provider';
    const img = `${import.meta.env.VITE_CLOUDINARY_UPLOAD}bookings/${ConferencingIntegrationLogos[profile.provider_name]}`;

    return {
      label,
      value: profile.profile_id,
      img,
    };
  });

  if (serviceHasCustomLink && serviceCustomLink) {
    options.push(customLinkOption as Option);
  }

  return options;
};
