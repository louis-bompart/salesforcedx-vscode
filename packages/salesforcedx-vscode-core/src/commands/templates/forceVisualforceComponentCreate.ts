/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  Command,
  SfdxCommandBuilder
} from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { nls } from '../../messages';
import {
  CompositeParametersGatherer,
  FilePathExistsChecker,
  SelectFileName,
  SelectOutputDir,
  SfdxCommandlet,
  SfdxWorkspaceChecker
} from '../commands';
import { BaseTemplateCommand } from './baseTemplateCommand';

const VF_CMP_EXTENSION = '.component';

class ForceVisualForceComponentCreateExecutor extends BaseTemplateCommand {
  public build(data: DirFileNameSelection): Command {
    return new SfdxCommandBuilder()
      .withDescription(nls.localize('force_visualforce_component_create_text'))
      .withArg('force:visualforce:component:create')
      .withFlag('--componentname', data.fileName)
      .withFlag('--label', data.fileName)
      .withFlag('--outputdir', data.outputdir)
      .withLogName('force_visualforce_component_create')
      .build();
  }

  public createSubDirectory(): boolean {
    return false;
  }

  public getFileExtension(): string {
    return VF_CMP_EXTENSION;
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const fileNameGatherer = new SelectFileName();
const filePathExistsChecker = new FilePathExistsChecker(VF_CMP_EXTENSION);

export async function forceVisualforceComponentCreate() {
  const outputDirGatherer = new SelectOutputDir('components');
  const parameterGatherer = new CompositeParametersGatherer<
    DirFileNameSelection
  >(fileNameGatherer, outputDirGatherer);
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceVisualForceComponentCreateExecutor(),
    filePathExistsChecker
  );
  await commandlet.run();
}
