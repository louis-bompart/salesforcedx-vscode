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

const APEX_TRIGGER_EXTENSION = '.trigger';

export class ForceApexTriggerCreateExecutor extends BaseTemplateCommand {
  public build(data: DirFileNameSelection): Command {
    return new SfdxCommandBuilder()
      .withDescription(nls.localize('force_apex_trigger_create_text'))
      .withArg('force:apex:trigger:create')
      .withFlag('--triggername', data.fileName)
      .withFlag('--outputdir', data.outputdir)
      .withLogName('force_apex_trigger_create')
      .build();
  }

  public createSubDirectory(): boolean {
    return false;
  }

  public getFileExtension(): string {
    return APEX_TRIGGER_EXTENSION;
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const fileNameGatherer = new SelectFileName();
const filePathExistsChecker = new FilePathExistsChecker(APEX_TRIGGER_EXTENSION);

export async function forceApexTriggerCreate() {
  const outputDirGatherer = new SelectOutputDir('triggers');
  const parameterGatherer = new CompositeParametersGatherer<
    DirFileNameSelection
  >(fileNameGatherer, outputDirGatherer);
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceApexTriggerCreateExecutor(),
    filePathExistsChecker
  );
  await commandlet.run();
}
