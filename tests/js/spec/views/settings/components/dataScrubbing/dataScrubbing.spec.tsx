import React from 'react';

import {mountWithTheme} from 'sentry-test/enzyme';

import DataScrubbing from 'app/views/settings/components/dataScrubbing';
import {ProjectSlug} from 'app/views/settings/components/dataScrubbing/types';
import {addSuccessMessage} from 'app/actionCreators/indicator';

jest.mock('app/actionCreators/indicator');

const relayPiiConfig = {
  rules: {
    '0': {type: 'password', redaction: {method: 'replace', text: 'Scrubbed'}},
    '1': {type: 'creditcard', redaction: {method: 'mask'}},
  },
  applications: {password: ['0'], $message: ['1']},
};

const stringRelayPiiConfig = JSON.stringify(relayPiiConfig);

const rules = [
  {
    id: 0,
    method: 'replace',
    placeholder: 'Scrubbed',
    source: 'password',
    type: 'password',
  },
  {id: 1, method: 'mask', source: '$message', type: 'creditcard'},
];

const organizationSlug = 'sentry';
const handleUpdateOrganization = jest.fn();
const additionalContext = 'These rules can be configured for each project.';

function getOrganization(piiConfig?: string) {
  // @ts-ignore
  return TestStubs.Organization(
    piiConfig ? {id: '123', relayPiiConfig: piiConfig} : {id: '123'}
  );
}

function renderComponent({
  disabled,
  projectSlug,
  endpoint,
  ...props
}: Partial<Omit<DataScrubbing<ProjectSlug>['props'], 'endpoint'>> &
  Pick<DataScrubbing<ProjectSlug>['props'], 'endpoint'>) {
  const organization = props.organization ?? getOrganization();
  if (projectSlug) {
    return mountWithTheme(
      <DataScrubbing
        additionalContext={additionalContext}
        endpoint={endpoint}
        projectSlug={projectSlug}
        relayPiiConfig={stringRelayPiiConfig}
        disabled={disabled}
        organization={organization}
        onSubmitSuccess={handleUpdateOrganization}
      />
    );
  }
  return mountWithTheme(
    <DataScrubbing
      additionalContext={additionalContext}
      endpoint={endpoint}
      relayPiiConfig={stringRelayPiiConfig}
      disabled={disabled}
      organization={organization}
      onSubmitSuccess={handleUpdateOrganization}
    />
  );
}

describe('Data Scrubbing', () => {
  describe('Organization level', () => {
    const endpoint = `organization/${organizationSlug}/`;

    it('default render', () => {
      const wrapper = renderComponent({disabled: false, endpoint});

      //State
      expect(wrapper.state().rules).toEqual(rules);

      // PanelHeader
      expect(wrapper.find('PanelHeader').text()).toEqual('Advanced Data Scrubbing');

      //PanelAlert
      const panelAlert = wrapper.find('PanelAlert');
      expect(panelAlert.text()).toEqual(
        `${additionalContext} The new rules will only apply to upcoming events.  For more details, see full documentation on data scrubbing.`
      );

      const readDocsLink = panelAlert.find('a');
      expect(readDocsLink.text()).toEqual('full documentation on data scrubbing');
      expect(readDocsLink.prop('href')).toEqual(
        'https://docs.sentry.io/data-management/advanced-datascrubbing/'
      );

      //PanelBody
      const panelBody = wrapper.find('PanelBody');
      expect(panelBody).toHaveLength(1);
      expect(panelBody.find('ListItem')).toHaveLength(2);

      // OrganizationRules
      const organizationRules = panelBody.find('OrganizationRules');
      expect(organizationRules).toHaveLength(0);

      // PanelAction
      const actionButtons = wrapper.find('PanelAction').find('Button');
      expect(actionButtons).toHaveLength(2);
      expect(actionButtons.at(0).text()).toEqual('Read the docs');
      expect(actionButtons.at(1).text()).toEqual('Add Rule');
      expect(actionButtons.at(1).prop('disabled')).toEqual(false);

      expect(wrapper).toMatchSnapshot();
    });

    it('render disabled', () => {
      const wrapper = renderComponent({disabled: true, endpoint});

      //PanelBody
      const panelBody = wrapper.find('PanelBody');
      expect(panelBody).toHaveLength(1);
      expect(panelBody.find('List').prop('isDisabled')).toEqual(true);

      // PanelAction
      const actionButtons = wrapper.find('PanelAction').find('Button');
      expect(actionButtons).toHaveLength(2);
      expect(actionButtons.at(0).prop('disabled')).toEqual(false);
      expect(actionButtons.at(1).prop('disabled')).toEqual(true);
    });
  });

  describe('Project level', () => {
    const projectSlug = 'foo';
    const endpoint = `/projects/${organizationSlug}/${projectSlug}/`;

    it('default render', () => {
      const wrapper = renderComponent({
        disabled: false,
        projectSlug,
        endpoint,
      });

      //State
      expect(wrapper.state().rules).toEqual(rules);

      // PanelHeader
      expect(wrapper.find('PanelHeader').text()).toEqual('Advanced Data Scrubbing');

      //PanelAlert
      const panelAlert = wrapper.find('PanelAlert');
      expect(panelAlert.text()).toEqual(
        `${additionalContext} The new rules will only apply to upcoming events.  For more details, see full documentation on data scrubbing.`
      );

      const readDocsLink = panelAlert.find('a');
      expect(readDocsLink.text()).toEqual('full documentation on data scrubbing');
      expect(readDocsLink.prop('href')).toEqual(
        'https://docs.sentry.io/data-management/advanced-datascrubbing/'
      );

      //PanelBody
      const panelBody = wrapper.find('PanelBody');
      expect(panelBody).toHaveLength(1);
      expect(panelBody.find('ListItem')).toHaveLength(2);

      // OrganizationRules
      const organizationRules = panelBody.find('OrganizationRules');
      expect(organizationRules).toHaveLength(1);
      expect(organizationRules.text()).toEqual(
        'There are no data scrubbing rules at the organization level'
      );

      // PanelAction
      const actionButtons = wrapper.find('PanelAction').find('Button');
      expect(actionButtons).toHaveLength(2);
      expect(actionButtons.at(0).text()).toEqual('Read the docs');
      expect(actionButtons.at(1).text()).toEqual('Add Rule');
      expect(actionButtons.at(1).prop('disabled')).toEqual(false);

      expect(wrapper).toMatchSnapshot();
    });

    it('render disabled', () => {
      const wrapper = renderComponent({disabled: true, endpoint});

      //PanelBody
      const panelBody = wrapper.find('PanelBody');
      expect(panelBody).toHaveLength(1);
      expect(panelBody.find('List').prop('isDisabled')).toEqual(true);

      // PanelAction
      const actionButtons = wrapper.find('PanelAction').find('Button');
      expect(actionButtons).toHaveLength(2);
      expect(actionButtons.at(0).prop('disabled')).toEqual(false);
      expect(actionButtons.at(1).prop('disabled')).toEqual(true);
    });

    it('OrganizationRules has content', () => {
      const wrapper = renderComponent({
        disabled: false,
        organization: getOrganization(stringRelayPiiConfig),
        projectSlug,
        endpoint,
      });

      // OrganizationRules
      const organizationRules = wrapper.find('OrganizationRules');
      expect(organizationRules).toHaveLength(1);
      expect(organizationRules.find('Header').text()).toEqual('Organization Rules');
      const listItems = organizationRules.find('ListItem');
      expect(listItems).toHaveLength(2);
      expect(listItems.at(0).find('[role="button"]')).toHaveLength(0);
    });

    it('Delete rule successfully', async () => {
      // @ts-ignore
      const mockDelete = MockApiClient.addMockResponse({
        url: endpoint,
        method: 'PUT',
        body: getOrganization(
          JSON.stringify({...relayPiiConfig, rules: {0: relayPiiConfig.rules[0]}})
        ),
      });

      const wrapper = renderComponent({
        disabled: false,
        projectSlug,
        endpoint,
      });

      const listItems = wrapper.find('ListItem');
      const deleteButton = listItems
        .at(0)
        .find('[aria-label="Delete Rule"]')
        .hostNodes();

      deleteButton.simulate('click');
      expect(mockDelete).toHaveBeenCalled();
      // @ts-ignore
      await tick();
      wrapper.update();
      expect(wrapper.state().rules).toHaveLength(1);
      expect(addSuccessMessage).toHaveBeenCalled();
    });
  });
});
